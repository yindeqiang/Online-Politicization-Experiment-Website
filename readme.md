# Online Politicization Experiment Website Repo

This repo contains the source code for the experiment website which you can run on your local server. You can also rerun or modify the data analysis code in the repo to reproduce the results in the paper.

## 1. Usage

### 1.1. Run the experiment website

Run the following command to install dependencies for the repo:
```bash
conda env create -f environment.yaml
conda activate web_development
```
Then you can start the website on your local server using the following command. The local url displayed in the info should be http://127.0.0.1:5000 (the port may be different). Use your browser to access the website. (*Chrome* or *Firefox* recommended). You can press [Ctrl + C] to terminate the process.
```bash
flask --app app/server --debug run
```

### 1.2. Run the data analysis code
You need to login to PythonAnywhere website before downloading the data and running the analysis code. ``data_analysis/key.py`` is ignored in .git so you need to create the file which contains the passwords for ssh connection and the database.