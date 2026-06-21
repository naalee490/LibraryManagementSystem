export interface Book {
    bookID: number;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    year: number;
    availableCopies: number;
}

export interface Loan {
    loanID: number;
    borrowDate: string;
    dueDate: string;
    returnDate?: string | null;
    status: string;
    book: Book;
    user?: {
        id: number;
        username: string;
        firstName?: string;
        lastName?: string;
    };
}
