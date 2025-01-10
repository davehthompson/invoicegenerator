# Modern Invoice Generator

A sleek, professional invoice generator built with React and Vite. Create, customize, and export beautiful invoices with ease.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- 🎨 Modern, responsive interface with real-time preview
- 💾 Automatic saving of drafts using local storage
- 📤 Export to PDF or generate annual invoice sets
- 🏢 Industry-specific templates and demo data
- 🖼️ Custom logo upload and management
- 💰 Flexible tax calculation (percentage or fixed amount)
- 🏦 Comprehensive remittance information
- 📱 Mobile-friendly design
- 🎭 Fun paper effects (crumple, coffee stains)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/invoice-generator.git
cd invoice-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🛠️ Built With

- [React](https://reactjs.org/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) - PDF Generation
- [html2canvas](https://html2canvas.hertzen.com/) - Image Generation
- [JSZip](https://stuk.github.io/jszip/) - ZIP File Generation

## 📁 Project Structure

The project follows a domain-driven directory structure:

```
src/
  ├── invoice/           # Invoice-related components and logic
  ├── shared/           # Shared utilities and components
  ├── assets/           # Static assets
  └── utils/            # Helper functions
```

## 🔧 Configuration

The application uses various configuration files:

- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `eslint.config.js` - ESLint configuration

## 💾 Storage

The application uses browser local storage for:
- Draft invoices
- User preferences
- Recent invoice history

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Invoice design inspired by modern business practices
- Paper effects inspired by creative CSS techniques
- Demo data generated to represent realistic business scenarios
