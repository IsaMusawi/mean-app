import { Component, OnInit, OnDestroy} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  // posts = [
  //   {title: 'First Post', content: 'This is the 1st post\'s content'},
  //   {title: 'Second Post', content: 'This is the 2nd post\'s content'},
  //   {title: 'Third Post', content: 'This is the 3rd post\'s content'},
  // ]

  posts: Post[] = [];
  isLoading = false;
  totalPost = 0;
  postPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10];
  private postsSub: Subscription;
  // postsService: PostsService;

  constructor(public postsService: PostsService) {}

  postUpdateListener(): void {
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPost = postData.postCount;
      this.posts = postData.posts;        
    });
  };


  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postUpdateListener();
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading =true;
    this.postPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postUpdateListener();
  }

  ngOnDestroy(): void {
      this.postsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading =true;
    this.postsService.deletePost(postId).subscribe(() => {
      if (this.totalPost/this.postPerPage < this.currentPage){
        this.currentPage = this.currentPage - 1;
      }
      this.postsService.getPosts(this.postPerPage, this.currentPage)
    });
    this.postUpdateListener();
  }
}
