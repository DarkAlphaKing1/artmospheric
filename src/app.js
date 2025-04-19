import React from 'react';
import './App.css';
import ContactForm from './components/ContactForm';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Interior Design Company</h1>
            </header>
            <main>
                <ContactForm />
            </main>
        </div>
    );
}

export default App;