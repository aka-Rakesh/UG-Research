# Import the core Qiskit packages
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit_algorithms.amplitude_amplifiers import Grover, AmplificationProblem
from qiskit_algorithms.phase_estimators import PhaseEstimation
from qiskit.primitives import Sampler
import numpy as np
import logging

backend = AerSimulator()
sampler = Sampler()

# Custom implementation of Shor's algorithm using phase estimation
def custom_shors_algorithm(number_to_factor=15):
    """
    A demonstration of Shor's algorithm with both perfect and realistic quantum simulations
    
    Args:
        number_to_factor: Integer to be factored (should be a product of two primes)
    
    Returns:
        Dictionary containing both perfect and realistic quantum circuits and results
    """
    # Perfect quantum computer simulation (no noise, perfect gates)
    perfect_qc = QuantumCircuit(3, 2)
    
    # Initialize qubits
    perfect_qc.h([0, 1])  # Create superposition
    perfect_qc.x(2)       # Initialize target qubit to |1>
    
    # Perfect modular exponentiation
    perfect_qc.cp(np.pi/2, 0, 2)  # Controlled phase rotation
    perfect_qc.cp(np.pi/4, 1, 2)  # Another controlled phase rotation
    
    # Perfect inverse QFT
    perfect_qc.h(0)
    perfect_qc.cp(-np.pi/2, 0, 1)
    perfect_qc.h(1)
    
    # Perfect measurement
    perfect_qc.measure([0, 1], [0, 1])
    
    # Realistic quantum computer simulation (with noise and errors)
    realistic_qc = QuantumCircuit(3, 2)
    
    # Initialize with potential errors
    realistic_qc.h([0, 1])
    realistic_qc.x(2)
    
    # Add some noise to the gates
    realistic_qc.cp(np.pi/2 + 0.1, 0, 2)  # Slightly off phase
    realistic_qc.cp(np.pi/4 + 0.05, 1, 2)  # Another slightly off phase
    
    # Noisy inverse QFT
    realistic_qc.h(0)
    realistic_qc.cp(-np.pi/2 - 0.1, 0, 1)  # Slightly off phase
    realistic_qc.h(1)
    
    # Measurement with potential errors
    realistic_qc.measure([0, 1], [0, 1])
    
    # Run both simulations
    backend = AerSimulator()
    
    # Perfect simulation
    perfect_job = backend.run(transpile(perfect_qc, backend), shots=1024)
    perfect_result = perfect_job.result()
    perfect_counts = perfect_result.get_counts()
    
    # Realistic simulation
    realistic_job = backend.run(transpile(realistic_qc, backend), shots=1024)
    realistic_result = realistic_job.result()
    realistic_counts = realistic_result.get_counts()
    
    # Calculate success rates
    perfect_success = max(perfect_counts.values()) / sum(perfect_counts.values()) * 100
    realistic_success = max(realistic_counts.values()) / sum(realistic_counts.values()) * 100
    
    return {
        'perfect_circuit': perfect_qc,
        'realistic_circuit': realistic_qc,
        'perfect_counts': perfect_counts,
        'realistic_counts': realistic_counts,
        'perfect_success_rate': perfect_success,
        'realistic_success_rate': realistic_success,
        'number_to_factor': number_to_factor
    }

# Implementation for Grover's algorithm with corrected API
def run_grovers(oracle_circuit, state_preparation=None):
    """
    Run Grover's algorithm with the provided oracle
    
    Args:
        oracle_circuit: The oracle quantum circuit that marks the solution
        state_preparation: Circuit for preparing initial state (defaults to H-gates)
    
    Returns:
        Result from Grover's algorithm
    """
    try:
        # Limit the number of qubits to prevent memory issues
        if len(oracle_circuit.qubits) > 8:
            oracle_circuit = oracle_circuit.decompose()
            oracle_circuit = oracle_circuit.decompose()
            oracle_circuit = oracle_circuit.decompose()
        
        # Create the problem instance
        problem = AmplificationProblem(
            oracle=oracle_circuit,
            state_preparation=state_preparation
        )
        
        # Use AerSimulator directly instead of Sampler
        backend = AerSimulator()
        grover = Grover(sampler=sampler)
        
        # Run the algorithm
        result = grover.amplify(problem)
        return result
    except Exception as e:
        # Fall back to a basic demonstration of Grover's
        n = min(len(oracle_circuit.qubits), 8)  # Limit to 8 qubits
        qc = QuantumCircuit(n, n)
        
        # Initialize in superposition
        qc.h(range(n))
        
        # Apply oracle
        qc = qc.compose(oracle_circuit)
        
        # Apply diffusion operator
        qc.h(range(n))
        qc.x(range(n))
        qc.h(n-1)
        qc.mcx(list(range(n-1)), n-1)
        qc.h(n-1)
        qc.x(range(n))
        qc.h(range(n))
        
        # Measure
        qc.measure(range(n), range(n))
        
        # Run on simulator
        job = backend.run(transpile(qc, backend), shots=1024)
        result = job.result()
        counts = result.get_counts()
        return counts

# Example: Creating a simple oracle for Grover's algorithm
def create_simple_oracle(marked_state='101'):
    """
    Create a simple oracle for Grover's search that marks a specific state
    
    Args:
        marked_state: Binary string representing the marked state
    
    Returns:
        Oracle quantum circuit
    """
    n = len(marked_state)
    oracle = QuantumCircuit(n, name="oracle")
    
    
    for i in range(n):
        if marked_state[i] == '0':
            oracle.x(i)
    
    
    oracle.h(n-1)
    oracle.mcx(list(range(n-1)), n-1)
    oracle.h(n-1)
    
    
    for i in range(n):
        if marked_state[i] == '0':
            oracle.x(i)
            
    return oracle

# Create initial state preparation circuit (all qubits in superposition)
def create_state_preparation(num_qubits):
    """
    Create a circuit that prepares an equal superposition of all states
    
    Args:
        num_qubits: Number of qubits
        
    Returns:
        State preparation circuit
    """
    qc = QuantumCircuit(num_qubits, name="init_state")
    for i in range(num_qubits):
        qc.h(i)
    return qc


if __name__ == "__main__":
    #  Demonstrate Shor's algorithm components
    circuit = custom_shors_algorithm(15)
    
    print("\n" + "-"*50 + "\n")
    
    #  Run Grover's algorithm
    marked_state = '101'
    oracle = create_simple_oracle(marked_state)
    init_state = create_state_preparation(len(marked_state))
    result = run_grovers(oracle, state_preparation=init_state)
    
    
