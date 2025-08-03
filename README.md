# 🚀 Startup Maturity Engine

A sophisticated AI-powered startup idea analyzer that transforms raw business concepts into comprehensive analysis reports with investment strategies and actionable launch plans.

## ✨ Features

- **🔍 Intelligent Validation**: Automatically detects and filters nonsense inputs with witty feedback
- **📊 Multi-Dimensional Scoring**: Evaluates market size, competition, feasibility, monetization, and scalability
- **💡 Strategic Improvements**: Provides actionable recommendations for product-market fit, branding, and pricing
- **💰 Investment Strategy**: Generates tailored funding approaches with specific investor recommendations
- **🚀 Launch Planning**: Creates 90-day action plans with community building and growth tactics
- **⚡ Powered by Groq**: Lightning-fast AI inference using Groq's optimized infrastructure
- **🔗 LangChain Integration**: Sophisticated multi-step analysis pipeline with error handling

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with experimental Partial Prerendering (PPR)
- **Language**: TypeScript for full type safety
- **Styling**: Tailwind CSS for beautiful, responsive design
- **AI/ML**: LangChain.js with Groq AI for rapid inference
- **Deployment**: Optimized for Vercel with serverless functions

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.0 or higher
- A free Groq API key ([Get one here](https://console.groq.com/keys))

### Installation

1. **Clone and setup the project**:

```bash
npx create-next-app@latest startup-maturity-engine --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd startup-maturity-engine
```

2. **Install dependencies**:

```bash
npm install ai @ai-sdk/openai langchain @langchain/community @langchain/core @langchain/groq groq-sdk zod
```

3. **Setup environment variables**:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Groq API key:

```bash
GROQ_API_KEY=your_actual_groq_api_key_here
```

4. **Run the development server**:

```bash
npm run dev
```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
startup-maturity-engine/
├── app/
│   ├── api/analyze/route.ts      # Main API endpoint
│   ├── page.tsx                  # UI component
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── lib/
│   ├── startup-chain.ts          # LangChain pipeline
│   └── types.ts                  # TypeScript interfaces
├── components/ui/
│   └── loading.tsx               # Loading component
├── next.config.js                # Next.js configuration
└── package.json                  # Dependencies
```

## 🔄 How It Works

The Startup Maturity Engine uses a sophisticated 5-step LangChain pipeline:

### Step 1: Input Validation & Sanitization

- Detects legitimate business ideas vs nonsense
- Provides satirical feedback for joke inputs
- Extracts core business concept, target market, and value proposition

### Step 2: Comprehensive Scoring

- Multi-dimensional analysis across 5 key metrics
- Benchmarking against successful startups (Palantir, Stripe, Airbnb)
- Detailed pros/cons analysis with market insights

### Step 3: Strategic Improvements

- Product-market fit optimization
- Brand positioning recommendations
- Pricing strategy alternatives
- MVP feature prioritization

### Step 4: Investment Strategy

- Investor type matching
- Pitch deck outline generation
- Specific investor recommendations
- Networking and introduction strategies

### Step 5: Launch & Growth Plan

- Early adopter acquisition channels
- Community building strategies
- Key metrics tracking
- 90-day actionable roadmap

## 🎯 Usage Examples

### Valid Startup Ideas

```
"A mobile app that uses AI to help people meal plan based on their dietary restrictions, budget, and local grocery store prices. Users can scan receipts to track spending and get personalized recipe recommendations that minimize food waste."
```

### Satirical Responses

The system detects and responds humorously to nonsense inputs like:

- "A startup that sells air in jars"
- "An app for teaching fish to code"
- Random text or incomplete thoughts

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**:
   - Connect your GitHub repository
   - Add your `GROQ_API_KEY` environment variable
   - Deploy automatically

### Environment Variables for Production

```bash
GROQ_API_KEY=your_production_groq_api_key
NODE_ENV=production
```

## 🔧 Configuration

### Next.js 15 Features

- **Partial Prerendering (PPR)**: Enabled for optimal performance
- **Server Components**: Optimized for AI package handling
- **Bundle Optimization**: Configured for large AI/ML dependencies

### Groq Configuration

- **Model**: `mixtral-8x7b-32768` for optimal speed/quality balance
- **Temperature**: 0.7 for balanced creativity
- **Max Tokens**: 2048 for detailed responses

## 🛡️ Error Handling

The application includes comprehensive error handling:

- **Input validation** with helpful error messages
- **API timeout protection** (30-second limit)
- **JSON parsing** with fallback mechanisms
- **Rate limiting** detection and user feedback
- **Step-by-step** error tracking and recovery

## 📊 Performance

- **Analysis Time**: Typically 30-60 seconds for complete evaluation
- **Groq Speed**: Sub-second inference per chain step
- **Bundle Size**: Optimized for serverless deployment
- **Memory Usage**: Efficient handling of large language models

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq**: For providing lightning-fast AI inference
- **LangChain**: For the sophisticated chaining framework
- **Next.js**: For the excellent React framework
- **Vercel**: For seamless deployment platform

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/startup-maturity-engine/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ for entrepreneurs and startup enthusiasts worldwide** 🌍
