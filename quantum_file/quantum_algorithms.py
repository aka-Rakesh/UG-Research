# Import the core Qiskit packages
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator


from qiskit_algorithms.amplitude_amplifiers import Grover, AmplificationProblem


from qiskit_algorithms.phase_estimators import PhaseEstimation


from qiskit.primitives import StatevectorSampler


backend = AerSimulator()
sampler = StatevectorSampler()

# Custom implementation of Shor's algorithm using phase estimation
def custom_shors_algorithm(number_to_factor=15):
    """
    A simplified educational demonstration of Shor's algorithm approach
    Note: This is not a full implementation, just illustrative
    
    Args:
        number_to_factor: Integer to be factored
    
    Returns:
        Information about the factorization process
    """
    print(f"Demonstrating components of Shor's algorithm for factoring {number_to_factor}")
    
    qc = QuantumCircuit(3, 2)
    qc.h([0, 1])  
    qc.x(2)      
    
    
    qc.cp(np.pi/2, 0, 2)
    qc.cp(np.pi/4, 1, 2)
    
   
    qc.h(0)
    qc.cp(-np.pi/2, 0, 1)
    qc.h(1)
    
    qc.measure([0, 1], [0, 1])
    
    print("Created a simplified quantum phase estimation circuit:")
    print(qc.draw())
    print("\nNote: A full Shor's algorithm implementation would use this")
    print("to find the period of modular exponentiation, which is then")
    print("used in classical post-processing to find factors.")
    
    print("\nFor actual factorization, consider using specialized libraries")
    print("like 'qiskit-community/qiskit-nature' which may contain implementations.")
    
    return qc

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
        print("Running Grover's algorithm")
        
        
        problem = AmplificationProblem(
            oracle=oracle_circuit,
            state_preparation=state_preparation,
            is_good_state=None  
        )
        
        # Create a Grover instance
        grover = Grover(sampler)
        
        # Run the algorithm with the correct API for your version
       
        result = grover.amplify(problem)
        
        # Display results
        print(f"Most likely solution: {result.top_measurement}")
        return result
    except Exception as e:
        print(f"Error running Grover's algorithm: {e}")
        
        # Fall back to a basic demonstration of Grover's
        print("\nFalling back to basic Grover's algorithm demonstration:")
        n = len(oracle_circuit.qubits)
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
        
        print(qc.draw())
        
        # Run on simulator
        job = backend.run(transpile(qc, backend), shots=1024)
        result = job.result()
        counts = result.get_counts()
        print(f"Measurement results: {counts}")
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


import numpy as np


if __name__ == "__main__":
    #  Demonstrate Shor's algorithm components
    circuit = custom_shors_algorithm(15)
    
    print("\n" + "-"*50 + "\n")
    
    #  Run Grover's algorithm
    marked_state = '101'
    oracle = create_simple_oracle(marked_state)
    init_state = create_state_preparation(len(marked_state))
    result = run_grovers(oracle, state_preparation=init_state)
    
    
