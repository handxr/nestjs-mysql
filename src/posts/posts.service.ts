import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async createPost(post: CreatePostDto) {
    const author = await this.usersService.getUser(post.authorId);

    if (!author) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }

    const newPost = this.postsRepository.create(post);

    return await this.postsRepository.save(newPost);
  }

  async getPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }
}
