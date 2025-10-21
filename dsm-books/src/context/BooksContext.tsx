import React, { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { Book } from "../types";

interface BooksContextType {
    books: Book [];
}

const BooksContext = createContext<BooksContextType>({ books: []});

export const useBooks = () => useContext(BooksContext);

export const BooksProvider: React.FC<{ children: React.ReactNode}>= ({children}) => {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        axios.get('/data/books.json')
            .then(response => setBooks(response.data))
            .catch(err => console.error("Erro ao carregar books.json", err));
    },[]);

    return (
        <BooksContext.Provider value = {{ books}}>
            {children}
        </BooksContext.Provider>
    )
}    