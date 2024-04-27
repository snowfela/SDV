import os
import sys
import json
import pandas as pd
from sdv.single_table import CTGANSynthesizer
from sdv.evaluation.single_table import run_diagnostic, evaluate_quality, get_column_plot, get_column_pair_plot
from sdv.metadata import SingleTableMetadata

def get_column_plot(real_data, synthetic_data, column_name, metadata):
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots()
    ax.hist(real_data[column_name], bins=20, alpha=0.5, label='Real Data')
    ax.hist(synthetic_data[column_name], bins=20, alpha=0.5, label='Synthetic Data')
    ax.set_xlabel(column_name)
    ax.set_ylabel('Frequency')
    ax.set_title(f'Distribution of {column_name}')
    ax.legend()
    return fig

def get_column_pair_plot(real_data, synthetic_data, column_names, metadata):
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots()
    ax.scatter(real_data[column_names[0]], real_data[column_names[1]], label='Real Data')
    ax.scatter(synthetic_data[column_names[0]], synthetic_data[column_names[1]], label='Synthetic Data')
    ax.set_xlabel(column_names[0])
    ax.set_ylabel(column_names[1])
    ax.set_title(f'{column_names[0]} vs {column_names[1]}')
    ax.legend()
    return fig

def process_csv(input_file_path, output_file_path, sensitive_attributes=None):
    try:
        df = pd.read_csv(input_file_path)
        # Handle missing values (replace with appropriate values)
        df.fillna(value={'amenities_fee': 0}, inplace=True)  # Replace NaN with 0
        df['checkout_date'] = pd.to_datetime(df['checkout_date']).dt.strftime('%Y-%m-%d')  # Convert checkout_date to string format
        # df = df.dropna(subset=['checkout_date'])
        # # Convert Timestamp objects to string format
        # df = df.applymap(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if isinstance(x, pd.Timestamp) else str(x))
        # Extract metadata
        metadata = SingleTableMetadata()
        metadata.detect_from_dataframe(df)
        # Initialize the model
        synthesizer = CTGANSynthesizer(metadata=metadata)
        # Fit the synthesizer to real data
        synthesizer.fit(df)
        # Generate synthetic data
        synthetic_data = synthesizer.sample(len(df))
        # Save synthetic data to CSV file
        os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
        synthetic_data.to_csv(output_file_path, index=False)
        # Run diagnostic and evaluate quality
        diagnostic = run_diagnostic(real_data=df, synthetic_data=synthetic_data, metadata=metadata)
        quality_report = evaluate_quality(real_data=df, synthetic_data=synthetic_data, metadata=metadata)
        column_plot = get_column_plot(real_data=df, synthetic_data=synthetic_data, column_name="room_rate", metadata=metadata)
        column_pair_plot = get_column_pair_plot(real_data=df, synthetic_data=synthetic_data, column_names=["checkin_date", "checkout_date"], metadata=metadata)
        # Save graphs to results/generated_graphs folder
        os.makedirs("backend/results/generated_graphs", exist_ok=True)
        column_plot.savefig("backend/results/generated_graphs/column_plot.png")
        column_pair_plot.savefig("backend/results/generated_graphs/column_pair_plot.png")
    except Exception as e:
        print({"error": str(e)})

if __name__ == "__main__":
    # Check if the correct number of arguments is provided
    if len(sys.argv) != 3:
        print("Usage: python process_data.py <input_file_path> <output_file_path>")
        sys.exit(1)
    input_file_path = sys.argv[1]
    output_file_path = sys.argv[2]
    sensitive_attributes = ['guest_email', 'billing_address', 'credit_card_number']
    process_csv(input_file_path, output_file_path, sensitive_attributes)
