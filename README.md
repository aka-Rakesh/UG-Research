# Web3 Encryption Showcase

An interactive web application demonstrating various encryption techniques commonly used in Web3 and blockchain technology. Users can explore different encryption algorithms, see them in action, and test their understanding through an engaging guessing game.

## Features

- **Interactive Encryption Demo**: Choose from multiple encryption categories and algorithms
- **Real-time Encryption**: See instant results of encryption operations
- **Guessing Game**: Test your understanding by trying to guess the original text
- **Similarity Scoring**: Get feedback on how close your guess was to the original text
- **Educational Tool**: Learn about different encryption techniques used in Web3

## Supported Encryption Categories

1. **Hashing Algorithms**
   - SHA-256
   - Keccak-256
   - RIPEMD-160

2. **Public-Key Cryptography**
   - ECDSA (Elliptic Curve Digital Signature Algorithm)
   - EdDSA (Edwards-curve Digital Signature Algorithm)
   - RSA (Rivest-Shamir-Adleman)

3. **Symmetric Encryption**
   - AES (Advanced Encryption Standard)

4. **Zero-Knowledge Proofs**
   - zk-SNARKs
   - zk-STARKs

5. **Homomorphic Encryption**
   - Fully Homomorphic Encryption demonstration

6. **Secure Multi-Party Computation (SMPC)**
   - Basic SMPC implementation

7. **Threshold Cryptography**
   - Shamir's Secret Sharing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aka-Rakesh/UG-Research.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local server URL provided by Vite

## Tech Stack

- **React**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **crypto-js**: Cryptographic functions
- **elliptic**: Elliptic curve cryptography
- **snarkjs**: Zero-knowledge proof implementations
- **Lucide React**: Icon library

## Usage

1. Select an encryption category from the first dropdown
2. Choose a specific algorithm from the second dropdown
3. The application will display an encrypted version of a random sentence
4. Try to guess the original text in the input field
5. See how close your guess was with the similarity score
6. Use the "Reveal Original" button to see the actual text
7. Generate new sentences using the "Generate New" button

## Implementation Notes

- Some complex algorithms (zk-SNARKs, Homomorphic Encryption) are simplified for demonstration purposes
- The ECDSA implementation uses the secp256k1 curve, commonly used in blockchain applications
- Similarity scoring is based on word-by-word comparison
- The application includes proper error handling and input validation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
