import { Card, CardContent, Typography } from "@mui/material";
import { useBooks } from "../context/BooksContext";

export default function BookList() {
    const { books} = useBooks();

    return (
        <>
            {books.map((book, idx) => (
                <Card key={idx} sx={{ marginBottom: 2}}>
                    <CardContent>
                        <Typography variant="h6">{book.title}</Typography>
                        <Typography variant="body2">
                            {book.author} - {book.publisher} ({book.year}) | Disciplina: {book.course}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}