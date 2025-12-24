 const API_KEYS = [
  'AIzaSyCQsiLmLgazFbaWG9hOil-NegNeyVQwqAE',
  'AIzaSyDpcfWFUg0Mhs1thnHCEE8CchODE1VAaoQ',
  'AIzaSyAYf_kdEGmIdsCufZVl52sOKHw5XWvgwjY',
  'AIzaSyDnYcay_PE9STI1NDomtbbHJ-SmzLzuqzs',
  'AIzaSyBrOOTYSy4dGwDC2hFzvzZCUg5NtjF6kik',
  'AIzaSyC-hq4Qo3BGSPRzQNMH7Qb4bAvWPSbppoQ',

  // Add more API keys here as needed
];
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export class YouTubeService {
  static currentKeyIndex = 0;

  static getCurrentApiKey() {
    return API_KEYS[YouTubeService.currentKeyIndex];
  }

  static switchToNextKey() {
    YouTubeService.currentKeyIndex = (YouTubeService.currentKeyIndex + 1) % API_KEYS.length;
    console.warn(`Switched to next YouTube API key: index ${YouTubeService.currentKeyIndex}`);
  }

  static async searchVideos(query: string, maxResults: number = 20, language: string = 'all'): Promise<any[]> {
    let attempts = 0;
    const maxAttempts = API_KEYS.length;

    while (attempts < maxAttempts) {
      const apiKey = YouTubeService.getCurrentApiKey();
      try {
        let url = `${BASE_URL}/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${apiKey}`;
        if (language !== 'all') {
          url += `&relevanceLanguage=${language}`;
        }
        console.log(`YouTubeService.searchVideos: Fetching URL: ${url}`);
        const response = await fetch(url);
        console.log(`YouTubeService.searchVideos: Response status: ${response.status} ${response.statusText}`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`YouTube API search error: ${response.statusText}, details: ${errorText}`);
          if (response.status === 403 && errorText.includes('quotaExceeded')) {
            YouTubeService.switchToNextKey();
            attempts++;
            continue;
          }
          throw new Error(`YouTube API search error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`YouTubeService.searchVideos: Received data items count: ${data.items ? data.items.length : 0}`);
        return data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
          publishedAt: item.snippet.publishedAt,
        }));
      } catch (error) {
        console.error('YouTube API Error:', error);
        throw error;
      }
    }
    console.error('All YouTube API keys have exceeded their quota.');
    return [];
  }

  static async getTrending(regionCode: string = 'US', maxResults: number = 10): Promise<any[]> {
    let attempts = 0;
    const maxAttempts = API_KEYS.length;

    while (attempts < maxAttempts) {
      const apiKey = YouTubeService.getCurrentApiKey();
      try {
        const url = `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&videoCategoryId=10&maxResults=${maxResults}&key=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 403) {
            YouTubeService.switchToNextKey();
            attempts++;
            continue;
          }
          throw new Error(`YouTube API trending error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
          viewCount: item.statistics.viewCount,
          publishedAt: item.snippet.publishedAt,
        }));
      } catch (error) {
        console.error('YouTube API Error:', error);
        throw error;
      }
    }
    console.error('All YouTube API keys have exceeded their quota.');
    return [];
  }

  static getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`;
  }
}
