import os
import sys
import pandas as pd
import json
from sdv.datasets.demo import download_demo, get_available_demos
from sdv.single_table import CTGANSynthesizer
from sdv.evaluation.single_table import run_diagnostic, evaluate_quality, get_column_plot, get_column_pair_plot
import logging
def process_csv(input_file_path, sensitive_attributes):
  try:
    # Read the CSV file
    df = pd.read_csv(input_file_path)

    # Get available demo datasets
    available_datasets = get_available_demos()
    if not available_datasets:
      return json.dumps({'error': 'No demo datasets available.'})

    # Choose a dataset (for demonstration, using the first one)
    dataset_name = available_datasets[0]

    # Download demo dataset metadata
    real_data, metadata = download_demo(modality='single_table', dataset_name=dataset_name)

    # Initialize CTGANSynthesizer with the metadata
    synthesizer = CTGANSynthesizer(metadata)

    # Fit the synthesizer to the real data
    synthesizer.fit(real_data)

    # Generate synthetic data
    synthetic_data = synthesizer.sample(len(df))

    # Perform evaluations
    diagnostic = run_diagnostic(real_data=real_data, synthetic_data=synthetic_data, metadata=metadata)
    quality_report = evaluate_quality(real_data, synthetic_data, metadata)
    column_plot = get_column_plot(real_data=real_data, synthetic_data=synthetic_data, column_name=sensitive_attributes, metadata=metadata)
    column_pair_plot = get_column_pair_plot(real_data=real_data, synthetic_data=synthetic_data, column_names=['0', '1'], metadata=metadata)

    # Prepare result directory
    result_dir = 'results/generated_csv'
    os.makedirs(result_dir, exist_ok=True)

    # Write synthetic data to CSV file
    output_file_path = os.path.join(result_dir, 'output.csv')
    synthetic_data.to_csv(output_file_path, index=False)

    # Prepare response data
    response_data = {
      'head': real_data.head().to_string(),
      'columnPlot': column_plot,
      'columnPairPlot': column_pair_plot
    }
# Print the JSON object being constructed at each step for debugging
    logging.debug("Constructed JSON object:\n%s", json.dumps(response_data, indent=4))
    return json.dumps(response_data)
  except Exception as e:
    return json.dumps({'error': f"Error processing CSV file: {e}"})

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python process_data.py <input_file_path> <output_file_path>")
        sys.exit(1)
    input_file_path = sys.argv[1]
    sensitive_attributes = sys.argv[2]
    accuracy = 100   
    process_csv(input_file_path, sensitive_attributes)