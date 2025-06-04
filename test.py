import pandas as pd

df = pd.read_csv("rule.csv")

for index, row in df.iterrows():
    rule = row['Rule']
    valid_exs1 = row['Valid E1']
    valid_exs2 = row['Valid E2']
    invalid_exs1 = row['Invalid E1']
    invalid_exs2 = row['Invalid E2']


    print(f"Rule: {rule}")
    print("Valid examples:")
    print(f"1. {valid_exs1}")
    print(f"2. {valid_exs2}")
    print("Invalid examples:")
    print(f"1. {invalid_exs1}")
    print(f"2. {invalid_exs2}")

    
    print("\n")  # Add a newline for better readability