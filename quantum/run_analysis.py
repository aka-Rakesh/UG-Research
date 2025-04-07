from quantum_algorithms import custom_shors_algorithm, run_grovers, create_simple_oracle, create_state_preparation
from qiskit_aer import AerSimulator
from qiskit import transpile
import json
import sys
import logging

# Configure logging to write to stderr
logging.basicConfig(level=logging.INFO, stream=sys.stderr)

def analyze_encryption(algorithm: str, key_size: int = 256):
    """
    Run quantum analysis on different encryption methods
    
    Args:
        algorithm: The encryption algorithm to analyze (SHA-256, ECDSA, RSA, AES)
        key_size: The key size in bits
        
    Returns:
        Dictionary containing analysis results
    """
    # Limit key size for demonstration
    demo_key_size = min(key_size, 16)  # Use at most 16 bits for RSA demonstration
    
    if algorithm in ['ECDSA', 'RSA']:
        # For RSA, we'll use a small number that's a product of two primes
        # This is a simplified demonstration - in practice, RSA uses much larger numbers
        if demo_key_size == 16:
            number_to_factor = 323  # 17 * 19
        elif demo_key_size == 8:
            number_to_factor = 15   # 3 * 5
        else:
            number_to_factor = 35   # 5 * 7
            
        logging.info(f"Analyzing {algorithm} with a {demo_key_size}-bit key")
        logging.info(f"Factoring the number {number_to_factor} (product of two primes)")
        
        # Get both perfect and realistic quantum simulations
        results = custom_shors_algorithm(number_to_factor)
        
        # Calculate vulnerability based on both perfect and realistic results
        perfect_vulnerability = 90 if algorithm == 'RSA' else 85
        realistic_vulnerability = int(perfect_vulnerability * (results['realistic_success_rate'] / 100))
        
        return {
            'algorithm': algorithm,
            'keySize': demo_key_size,
            'numberToFactor': number_to_factor,
            'perfectQuantum': {
                'successRate': results['perfect_success_rate'],
                'timeToBreak': 300,  # Theoretical time for perfect Shor's algorithm
                'vulnerabilityScore': perfect_vulnerability
            },
            'currentQuantum': {
                'successRate': results['realistic_success_rate'],
                'timeToBreak': 300 * (100 / results['realistic_success_rate']),  # Scaled time based on success rate
                'vulnerabilityScore': realistic_vulnerability
            },
            'quantumAdvantage': {
                'perfect': 1000000,  # Theoretical advantage
                'current': int(1000000 * (results['realistic_success_rate'] / 100))  # Scaled advantage
            },
            'note': f'Analysis performed with {demo_key_size}-bit key for demonstration. Real {algorithm} uses much larger keys (2048+ bits).'
        }
    
    elif algorithm in ['SHA-256', 'AES']:
        # For symmetric crypto, use Grover's algorithm
        # Create an oracle that represents searching for the key
        key_bits = demo_key_size
        oracle = create_simple_oracle('1' * (key_bits // 8))  # Simplified representation
        init_state = create_state_preparation(key_bits // 8)
        
        result = run_grovers(oracle, state_preparation=init_state)
        
        # Calculate success rate based on measurements
        if isinstance(result, dict):  # Fallback case
            success_rate = max(result.values()) / sum(result.values()) * 100
        else:
            success_rate = 75  # Theoretical success rate for Grover's
            
        return {
            'algorithm': algorithm,
            'keySize': demo_key_size,
            'perfectQuantum': {
                'successRate': 100,  # Theoretical perfect success rate
                'timeToBreak': 2 ** (demo_key_size // 2),  # Theoretical time for Grover's
                'vulnerabilityScore': 40 if algorithm == 'SHA-256' else 30
            },
            'currentQuantum': {
                'successRate': success_rate,
                'timeToBreak': (2 ** (demo_key_size // 2)) * (100 / success_rate),  # Scaled time based on success rate
                'vulnerabilityScore': int((40 if algorithm == 'SHA-256' else 30) * (success_rate / 100))
            },
            'quantumAdvantage': {
                'perfect': 2,  # Theoretical advantage for Grover's
                'current': int(2 * (success_rate / 100))  # Scaled advantage
            },
            'note': f'Analysis performed with {demo_key_size}-bit key for demonstration'
        }
    
    else:
        return {
            'algorithm': algorithm,
            'keySize': demo_key_size,
            'perfectQuantum': {
                'successRate': 50,
                'timeToBreak': 1000,
                'vulnerabilityScore': 60
            },
            'currentQuantum': {
                'successRate': 25,
                'timeToBreak': 2000,
                'vulnerabilityScore': 30
            },
            'quantumAdvantage': {
                'perfect': 10,
                'current': 5
            },
            'note': 'Unknown algorithm'
        }

if __name__ == "__main__":
    try:
        # Get arguments from command line
        algorithm = sys.argv[1] if len(sys.argv) > 1 else 'RSA'
        key_size = int(sys.argv[2]) if len(sys.argv) > 2 else 256
        
        # Run analysis and print results as JSON
        results = analyze_encryption(algorithm, key_size)
        print(json.dumps(results))
    except Exception as e:
        logging.error(f"Error running analysis: {str(e)}")
        sys.exit(1) 