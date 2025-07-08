# Recipe Generator

A web application that generates creative recipes based on user-provided ingredients, powered by AI.

## Features

- **Ingredient-based Recipe Generation**: Enter a list of ingredients, and the app creates a recipe for you.
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS.
- **Fast Backend**: Flask API with AI (Groq) integration to generate recipes in real time.
- **Error Handling**: User-friendly messages for invalid input and API errors.
- **Responsive Design**: Works on both desktop and mobile.


## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Python, Flask, Groq API, Gunicorn
- **Other Tools**: Docker, ESLint

## Getting Started

### Prerequisites

- Node.js (>=18)
- Python 3.8+
- Docker (optional, for containerized setup)

### Clone the repository

```bash
git clone https://github.com/NeuralNomad081/recipe.git
cd recipe
```

---

## Backend Setup (Flask API)

1. Go to the backend directory:
    ```bash
    cd backend
    ```

2. Create a `.env` file and add your Groq API key:
    ```
    GROQ_API_KEY=your-groq-api-key
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Run the Flask server:
    ```bash
    python app.py
    ```
    The API will run on `http://localhost:5000`.

---

## Frontend Setup (React)

1. Go to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add the API URL:
    ```
    VITE_API_URL=http://localhost:5000
    ```

4. Start the React development server:
    ```bash
    npm run dev
    ```
    The app will run on `http://localhost:5173`.

---

## Docker Setup (Optional)

You can run the frontend in a Docker container:

```bash
cd frontend
docker build -t recipe-frontend .
docker run -p 3000:3000 --env VITE_API_URL=http://host.docker.internal:5000 recipe-frontend
```

---

## Usage

1. Start the backend server.
2. Start the frontend app.
3. Enter ingredients in the input box and submit.
4. View generated recipes, including details like ingredients, instructions, cooking time, and servings.

---

## Folder Structure

```
recipe/
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── ...
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.

---

## License

This project is open source. License information can be added here.

---

## Credits

- [React](https://react.dev/)
- [Flask](https://flask.palletsprojects.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Groq API](https://groq.com/)
