import { Injectable } from '@nestjs/common';
import { algoliasearch, SearchClient, SearchResponse } from 'algoliasearch';
import dotenv from 'dotenv';
import { AlgoliaPost } from './algolia.interface';

dotenv.config();

@Injectable()
export class AlgoliaService {
  private client: SearchClient;
  private index: string;

  constructor() {
    const appId = process.env.ALGOLIA_APP_ID;
    const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
    this.index = process.env.ALGOLIA_INDEX_NAME as string;

    if (!appId || !adminKey) {
      throw new Error(
        'Algolia credentials are missing in environment variables',
      );
    }
    this.client = algoliasearch(appId, adminKey);
  }

  async searchPosts(query: string) {
    if (!query.trim()) {
      return [];
    }
    try {
      const result: SearchResponse<AlgoliaPost> =
        await this.client.searchSingleIndex({
          indexName: this.index,
          searchParams: { query: query },
        });
      const hitsWithId = result.hits.map((hit) => {
        const path = hit.path;
        const id = path.split('/').pop();
        return { ...hit, id };
      });
      return hitsWithId;
    } catch (error) {
      console.error('Error fetching posts from Algolia:', error);
      throw new Error('Error performing search');
    }
  }
}
