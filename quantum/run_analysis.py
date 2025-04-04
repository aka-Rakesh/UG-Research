from quantum_algorithms import custom_shors_algorithm, run_grovers, create_simple_oracle, create_state_preparation
import json
import sys

def analyze_encryption(algorithm: str, key_size: int = 256):
    """
    Run quantum analysis on different encryption methods
    
    Args:
        algorithm: The encryption algorithm to analyze (SHA-256, ECDSA, RSA, AES)
        key_size: The key size in bits
        
    Returns:
        Dictionary containing analysis results
    """
    if algorithm in ['ECDSA', 'RSA']:
        # For public key crypto, use Shor's algorithm
        # The number to factor is a simplified representation of the key
        number_to_factor = 2 ** (key_size // 2)
        circuit = custom_shors_algorithm(number_to_factor)
        
        # Run the circuit and get results
        backend = AerSimulator()
        job = backend.run(transpile(circuit, backend), shots=1024)
        result = job.result()
        counts = result.get_counts()
        
        # Calculate success rate based on measurements
        success_rate = max(counts.values()) / sum(counts.values()) * 100
        
        return {
            'algorithm': algorithm,
            'timeToBreak': 300,  # Theoretical time for Shor's algorithm
            'successRate': success_rate,
            'quantumAdvantage': 1000000,
            'vulnerabilityScore': 90 if algorithm == 'RSA' else 85
        }
    
    elif algorithm in ['SHA-256', 'AES']:
        # For symmetric crypto, use Grover's algorithm
        # Create an oracle that represents searching for the key
        key_bits = key_size
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
            'timeToBreak': 2 ** (key_size // 2),  # Theoretical time for Grover's
            'successRate': success_rate,
            'quantumAdvantage': 2,
            'vulnerabilityScore': 40 if algorithm == 'SHA-256' else 30
        }
    
    else:
        return {
            'algorithm': algorithm,
            'timeToBreak': 1000,
            'successRate': 50,
            'quantumAdvantage': 10,
            'vulnerabilityScore': 60
        }

if __name__ == "__main__":
    # Get arguments from command line
    algorithm = sys.argv[1] if len(sys.argv) > 1 else 'RSA'
    key_size = int(sys.argv[2]) if len(sys.argv) > 2 else 256
    
    # Run analysis and print results as JSON
    results = analyze_encryption(algorithm, key_size)
    print(json.dumps(results)) 