# Synthetic Data Generation (SDV) Project

## Overview
This project aims to develop a privacy-preserving model leveraging the Conditional Tabular Generative Adversarial Network (CTGAN) algorithm to generate synthetic data. The model ensures data utility while mitigating the risks associated with privacy breaches, such as attribute disclosure and re-identification attacks. By utilizing synthetic data, the project addresses the growing concerns over user privacy in data-sharing environments.

AI has the potential to both protect and threaten privacy. While AI techniques, like anonymization, can secure user data, they can also de-anonymize sensitive information, leading to potential privacy violations. The Synthetic Data Vault (SDV) tool generates synthetic datasets that mirror the original data but lack the actual sensitive details. However, when not handled properly, these synthetic data models can still pose significant privacy risks.


This project focuses on creating a robust privacy-preserving model that uses CTGAN to generate synthetic data with the following goals:
- Preserving data utility with minimal loss of information.
- Preventing privacy violations, including attribute disclosure and re-identification attacks.
- Developing privacy models that utilize both source and generated data for improved protection.

## Research Gap

- Existing anonymization methods often underestimate the potential privacy hazards posed by synthetic data.
- Current data anonymization strategies fail to account for how SD-based models can inadvertently expose real data when background data is accessible.
- There is a need for stronger algorithms to balance privacy protection and data utility.

## Solution

The project implements the Conditional Tabular Generative Adversarial Network (CTGAN), which efficiently generates synthetic data that closely resembles the original dataset but without revealing sensitive attributes. By utilizing CTGAN's capability to conditionally generate data based on different features, the synthetic data maintains a high level of data utility while ensuring user privacy.

## Key Features

- **Data Masking**: Generates synthetic data to mask essential details that could cause privacy issues if leaked.
- **Privacy-Preserving**: Minimizes risks of attribute disclosure and re-identification.
- **AI-driven Approach**: Uses CTGAN for advanced synthetic data generation.
- **Balanced Utility and Privacy**: Ensures the generated data is both useful for analysis and secure from privacy threats.
## Components
- **Backend**: Contains the core logic for data processing and CTGAN algorithm implementation.
- **Frontend**: Provides a user interface for interacting with the synthetic data generation system.
- **Node_Modules**: Includes necessary dependencies for the project.
- **Uploads**: Manages files uploaded by users for data generation.


### CTGAN (Conditional Tabular Generative Adversarial Network)

CTGAN is an advanced variant of Generative Adversarial Networks (GANs) designed specifically for generating synthetic tabular data. While traditional GANs are generally used for continuous data (such as images or audio), CTGAN is optimized for datasets that contain both continuous and categorical features, addressing the unique challenges associated with tabular data.

#### How CTGAN Differs from Normal GANs:

| Feature                      | **Normal GANs**                                    | **CTGAN**                                          |
|------------------------------|----------------------------------------------------|----------------------------------------------------|
| **Data Type Specialization**  | Primarily used for continuous data (e.g., images, audio) | Specially designed for tabular data with both categorical and continuous features |
| **Conditional Generation**    | Generates data without specific conditions         | Generates data based on specific conditions or input features |
| **Mode Collapse Handling**    | Susceptible to mode collapse, producing limited types of data | Uses techniques like Wasserstein loss with gradient penalty to mitigate mode collapse and produce diverse data |
| **Discriminators for Mixed Data** | Handles continuous data for the discriminator | Discriminators are designed to handle both categorical and continuous data in tabular datasets |

In summary, while traditional GANs excel at generating continuous data, CTGAN is specifically designed to handle the complexities of tabular datasets, making it ideal for generating synthetic data that preserves both the utility and statistical properties of real-world datasets.

## Installation
To set up the project, follow these steps:
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies using `npm install`.
4. Run the server.js file to launch the project.

## Languages Used
- Python 
- JavaScript
- Node.js
- HTML 
- CSS

## License
This project is open source and available under the MIT License.

