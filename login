Command:
curl -sS -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"username\":\"student1\",\"password\":\"password123\"}"

Output:
{"message":"Login successful","token":"<JWT_TOKEN_REDACTED>"}
