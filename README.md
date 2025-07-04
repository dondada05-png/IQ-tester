# IQ Tester - Modern Web App

A professional, responsive web application for conducting IQ tests with instant results and celebrity comparisons.

## 🧠 Features

- **55+ Question Database**: Large pool of carefully crafted multiple-choice questions
- **Random Question Selection**: Each test features 10 randomly selected questions for a unique experience
- **Progressive Difficulty**: Questions increase in difficulty from easy to extremely challenging
- **Instant IQ Calculation**: Linear scoring system (1 correct = IQ 70, 10 correct = IQ 160)
- **Celebrity Comparisons**: Compare your IQ with famous personalities like Nikola Tesla, Stephen Hawking, and more
- **Professional UI**: Clean, modern design with smooth animations and transitions
- **Fully Responsive**: Works perfectly on desktop and mobile devices
- **Detailed Explanations**: Learn from each question with comprehensive explanations
- **No Registration**: Completely free and anonymous
- **Endless Replayability**: Get new questions every time you restart the test

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd "IQ tester"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Start taking the IQ test!

## 🛠️ Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 📱 Screenshots

The app includes three main screens:
- **Start Screen**: Welcome page with test overview
- **Quiz Interface**: Interactive question interface with progress tracking
- **Results Screen**: Comprehensive results with IQ score and celebrity comparison

## 🎯 Scoring System

The IQ scoring uses a linear scale:
- 1 correct answer = IQ 79
- 5 correct answers = IQ 115 
- 10 correct answers = IQ 160

### Celebrity Comparisons

- **70-85**: Forrest Gump (fictional)
- **85-100**: Average Person
- **100-115**: Tom Cruise
- **115-130**: Natalie Portman
- **130-145**: Nikola Tesla
- **145-160**: Stephen Hawking
- **160+**: Terence Tao

## 🧩 Question Categories

1. **Numerical Sequences** - Pattern recognition
2. **Verbal Analogies** - Logical relationships
3. **Classification** - Category identification
4. **Logic Puzzles** - Deductive reasoning
5. **Mathematical Problems** - Analytical thinking

## 🔀 Random Question System

The app features a sophisticated question selection system:

- **55+ Total Questions**: A comprehensive database of IQ test questions
- **Smart Distribution**: Each test includes 2 easy, 3 medium, 3 hard, and 2 extreme questions
- **Progressive Difficulty**: Questions are ordered from easiest to most challenging
- **Unique Experience**: No two tests are exactly alike
- **Shuffle Feature**: Users can get new questions mid-test with the "New Questions" button
- **Balanced Assessment**: Ensures fair and consistent difficulty progression

## 🎨 Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for fast development and building
- **Responsive Design** for all screen sizes

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── StartScreen.tsx     # Welcome screen
│   ├── QuizInterface.tsx   # Quiz interface
│   └── ResultsScreen.tsx   # Results display
├── data/               # Application data
│   ├── questions.json      # IQ test questions
│   └── celebrities.ts      # Celebrity data
├── types/              # TypeScript definitions
│   └── index.ts           # Type definitions
├── utils/              # Utility functions
│   └── scoring.ts         # Scoring logic
├── App.tsx             # Main application
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🤝 Contributing

Feel free to contribute to this project by:
- Adding more questions
- Improving the UI/UX
- Adding new features
- Reporting bugs

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Enjoy Testing Your IQ!

Take the test, challenge your friends, and discover how your intelligence compares to famous personalities! 