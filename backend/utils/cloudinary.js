const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'cravecart';
        if (req.baseUrl.includes('restaurants')) {
            folder = 'cravecart/restaurants';
        } else if (req.baseUrl.includes('foods')) {
            folder = 'cravecart/foods';
        }
        return {
            folder: folder,
            allowed_formats: ['jpg', 'png', 'jpeg']
        };
    }
});

const upload = multer({ storage: storage });

/**
 * Smartly fetches an image from a URL (direct or webpage) and uploads it to Cloudinary.
 * @param {string} url - The image or page URL.
 * @param {string} folder - The Cloudinary folder to upload to.
 * @returns {Promise<string>} - The Cloudinary secure_url.
 */
const smartFetchImage = async (url, folder) => {
    try {
        const axios = require('axios');
        let targetImageUrl = url;

        console.log(`[SmartFetch] Processing URL: ${url}`);

        // If it's a webpage (not ending in common image extensions), try to find image metadata
        const isLikelyWebPage = !/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(url.split('?')[0]);

        if (isLikelyWebPage && url.startsWith('http')) {
            console.log(`[SmartFetch] Analyzing webpage for metadata...`);
            try {
                // TripAdvisor and others require very specific headers to avoid 403
                const { data: html } = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1',
                        'Cache-Control': 'max-age=0',
                        'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                        'Sec-Ch-Ua-Mobile': '?0',
                        'Sec-Ch-Ua-Platform': '"Windows"',
                        'Sec-Fetch-Dest': 'document',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-Site': 'none',
                        'Sec-Fetch-User': '?1'
                    },
                    timeout: 8000
                });

                // More robust metadata extraction
                const ogMatch = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/) ||
                    html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/);

                const twitterMatch = html.match(/name=["']twitter:image["']\s+content=["']([^"']+)["']/) ||
                    html.match(/content=["']([^"']+)["']\s+name=["']twitter:image["']/);

                const jsonLdMatch = html.match(/"image":\s*["']([^"']+)["']/) ||
                    html.match(/@type":\s*["']ImageObject["'].*?"url":\s*["']([^"']+)["']/s) ||
                    html.match(/"image":\s*\{[^}]*?"url":\s*["']([^"']+)["']/s);

                let bestImageUrl = null;

                if (jsonLdMatch && jsonLdMatch[1] && !jsonLdMatch[1].includes('placeholder')) {
                    bestImageUrl = jsonLdMatch[1];
                    console.log(`[SmartFetch] Found high-quality JSON-LD image: ${bestImageUrl}`);
                } else if (ogMatch && ogMatch[1]) {
                    bestImageUrl = ogMatch[1];
                    console.log(`[SmartFetch] Found og:image: ${bestImageUrl}`);
                } else if (twitterMatch && twitterMatch[1]) {
                    bestImageUrl = twitterMatch[1];
                    console.log(`[SmartFetch] Found twitter:image: ${bestImageUrl}`);
                }

                if (bestImageUrl) {
                    if (!bestImageUrl.startsWith('http')) {
                        const baseUrl = new URL(url).origin;
                        bestImageUrl = new URL(bestImageUrl, baseUrl).href;
                    }
                    targetImageUrl = bestImageUrl;
                } else {
                    console.log(`[SmartFetch] No metadata image found on page.`);
                    throw new Error('Could not find a valid image on the provided webpage link');
                }
            } catch (err) {
                console.error(`[SmartFetch] Webpage analysis failed: ${err.message}`);
                // If we get a 403, it's likely a scraper block
                if (err.response?.status === 403) {
                    throw new Error('This website is blocking our image fetcher. Please try copying the direct image address instead.');
                }
                if (err.message.includes('Could not find')) throw err;
                // Otherwise, it might be a direct image URL that just looked like a webpage (rare but possible)
            }
        }

        // Final check: if targetImageUrl is STILL likely a webpage, abort
        const finalIsWebPage = !/\.(jpg|jpeg|png|webp|gif|svg|avif|ico)$/i.test(targetImageUrl.split('?')[0]);
        if (finalIsWebPage && targetImageUrl.startsWith('http')) {
            console.error(`[SmartFetch] Aborting: target is still a webpage URL: ${targetImageUrl}`);
            throw new Error('The link provided is a webpage, and no preview image could be extracted.');
        }

        // Fetch the actual image data as a buffer
        console.log(`[SmartFetch] Fetching image content from: ${targetImageUrl}`);
        const response = await axios.get(targetImageUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Referer': url,
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            },
            timeout: 10000
        });

        const contentType = response.headers['content-type'] || 'image/jpeg';
        if (!contentType.startsWith('image/')) {
            console.warn(`[SmartFetch] Warning: content-type ${contentType} is not an image.`);
            if (contentType.includes('text/html')) {
                throw new Error('Fetched content is a webpage, not an image.');
            }
        }

        const buffer = Buffer.from(response.data, 'binary');
        const base64Image = `data:${contentType};base64,${buffer.toString('base64')}`;

        console.log(`[SmartFetch] Uploading buffer to Cloudinary...`);
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: folder,
            resource_type: 'auto'
        });

        console.log(`[SmartFetch] Success! URL: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error('[SmartFetch] Fatal Error:', error.message);
        throw new Error(error.message || 'Failed to fetch/upload image from provide link');
    }
};

module.exports = { cloudinary, upload, smartFetchImage };
