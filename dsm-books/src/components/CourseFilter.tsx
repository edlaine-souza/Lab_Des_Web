import { useBooks } from "../context/BooksContext";
import { MenuItem, Select, Typography, TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import { Book } from "../types"; // ajuste o caminho conforme necessário

export default function CourseFilter() {
    const { books } = useBooks();
    const [selectedCourse, setSelectedCourse] = useState("");
    const [searchText, setSearchText] = useState("");
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const courses = [...new Set(books.map(book => book.course))];

    const handleSearch = () => {
        const filtered = books.filter(book => {
            const matchesSelect = selectedCourse === "" || book.course === selectedCourse;
            const matchesText = book.course.toLowerCase().includes(searchText.toLowerCase());
            return matchesSelect && matchesText;
        });
        setFilteredBooks(filtered);
        setHasSearched(true);
    };

    const handleClear = () => {
        setSelectedCourse("");
        setSearchText("");
        setFilteredBooks([]);
        setHasSearched(false);
    };

    return (
        <>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Filtrar por Disciplina
            </Typography>

            <Select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                displayEmpty
                sx={{ mb: 2, minWidth: 200 }}
            >
                <MenuItem value="">Todas as Disciplinas</MenuItem>
                {courses.map(course => (
                    <MenuItem key={course} value={course}>
                        {course}
                    </MenuItem>
                ))}
            </Select>

            <TextField
                label="Buscar por nome da disciplina"
                variant="outlined"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                sx={{ mb: 2, minWidth: 300 }}
            />

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button variant="contained" onClick={handleSearch}>
                    Buscar
                </Button>
                <Button variant="outlined" onClick={handleClear}>
                    Limpar
                </Button>
            </Stack>

            {hasSearched && (
                filteredBooks.length > 0 ? (
                    filteredBooks.map((book, index) => (
                        <Typography key={index}>
                            {book.title} — {book.course}
                        </Typography>
                    ))
                ) : (
                    <Typography>Nenhum livro encontrado.</Typography>
                )
            )}
        </>
    );
}
