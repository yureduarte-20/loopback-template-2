export $(grep -vE '^#|^$' .env | xargs)
