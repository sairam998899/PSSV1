const API_KEY = 'AIzaSyBcWS9r_waJeqDESHlv6X5tnPhORWqwTZc'; // Replace with actual API key
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export class YouTubeService {
  static async searchVideos(query: string, maxResults: number = 20, language: string = 'all'): Promise<any[]> {
    try {
      let url = `${BASE_URL}/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${API_KEY}`;
      if (language !== 'all') {
        url += `&relevanceLanguage=${language}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`YouTube API search error: ${response.statusText}`);
      }
      const data = await response.json();
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      console.error('YouTube API Error:', error);
      return [];
    }
  }

  static async getTrending(regionCode: string = 'US', maxResults: number = 10): Promise<any[]> {
    try {
      const url = `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&videoCategoryId=10&maxResults=${maxResults}&key=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
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
      return [];
    }
  }

  static getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`;
  }
}
