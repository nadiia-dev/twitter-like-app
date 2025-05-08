import { Controller, Get, Query } from '@nestjs/common';
import { AlgoliaService } from './algolia.service';

@Controller('search')
export class AlgoliaController {
  constructor(private readonly algoliaService: AlgoliaService) {}

  @Get('posts')
  async searchPosts(@Query('query') query: string) {
    return await this.algoliaService.searchPosts(query);
  }
}
