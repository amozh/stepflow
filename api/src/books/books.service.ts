import { Injectable, HttpException } from '@nestjs/common';
import { BOOKS } from '../mocks/books.mock';
import { CreateBookDTO } from "@monorepify/shared/dist";

@Injectable()
export class BooksService {
  books = BOOKS;

  getBooks(): Promise<CreateBookDTO[]> {
    return new Promise(resolve => {
      resolve(this.books);
    });
  }
  getBook(bookID): Promise<any> {
    let id = Number(bookID);
    return new Promise(resolve => {
      const book = this.books.find(book => book.id === id);
      if (!book) {
        throw new HttpException('Book does not exist!', 404);
      }
      resolve(book);
    });
  }
}