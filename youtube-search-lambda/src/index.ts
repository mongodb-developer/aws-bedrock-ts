import axios from 'axios';

interface Event {
  agent: string;
  actionGroup: string;
  function: string;
  parameters: { name: string; value: string }[];
  messageVersion: string;
}

interface Context {
  // Add any necessary context properties
}

interface Video {
  title: string;
  description: string;
  thumbnail: string;
  video_id: string;
  url: string;
}

interface SearchResult {
  items: {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        default: { url: string };
      };
    };
  }[];
}

export const handler = async (event: Event, context: Context): Promise<any> => {
  const { agent, actionGroup, function: functionName, parameters } = event;

  // Extract query and maxResults from parameters
  const query = parameters.find(param => param.name === 'query')?.value || 'AWS services';
  const maxResults = parseInt(parameters.find(param => param.name === 'maxResults')?.value || '5', 10);

  // YouTube Data API v3 search endpoint
  const apiKey = process.env.YOUTUBE_API_KEY;
  const baseUrl = 'https://www.googleapis.com/youtube/v3/search';

  // Construct the URL with query parameters
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: maxResults.toString(),
    key: apiKey!
  });

  try {
    // Make the API request
    const response = await axios.get<SearchResult>(`${baseUrl}?${params}`);
    const searchResults = response.data;

    // Process the search results
    const videos: Video[] = searchResults.items.map(item => ({
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      video_id: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    // Prepare the response
    let responseText = `Here are ${videos.length} YouTube videos related to '${query}':\n\n`;
    videos.forEach((video, index) => {
      responseText += `${index + 1}. ${video.title}\n   ${video.url}\n\n`;
    });

    const actionResponse = {
      actionGroup,
      function: functionName,
      functionResponse: {
        responseBody: {
          TEXT: {
            body: responseText
          }
        }
      }
    };

    const functionResponse = { response: actionResponse, messageVersion: event.messageVersion };
    console.log(`Response: ${JSON.stringify(functionResponse)}`);
    return functionResponse;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};