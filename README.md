# datasets

Public domain datasets for Ohayo.

This project will turn CSVs into simple read-only web services via wrapping the great XSV library.

# Server setup on Ubuntu 18 on Digital Ocean

## Get this repo

    git clone https://github.com/treenotation/datasets

## Get XSV

    apt update
    apt install cargo
    cargo install xsv
    PATH=$PATH:/root/.cargo/bin
    cd datasets
    xsv headers baby-names.csv

## Setup web server

    apt install make
    cd
    git clone https://github.com/tj/n
    cd n
    make install
    n latest
    cd
    cd datasets
    npm install .
    ./app.js




