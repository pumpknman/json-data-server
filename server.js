const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const DATA_FILE = './data.json';

app.use(cors());
app.use(bodyParser.json());

// 데이터 파일 초기화 (파일이 없으면 빈 배열로 시작)
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// 데이터 불러오기
app.get('/api/data', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
});

// 데이터 저장하기
app.post('/api/data', (req, res) => {
    const newData = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data.push(newData);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(201).json({ message: 'Data saved successfully' });
});

// 데이터 삭제하기 (선택된 데이터 삭제)
app.post('/api/data/delete', (req, res) => {
    const idsToDelete = req.body.ids;
    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data = data.filter((item, index) => !idsToDelete.includes(index));
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Selected data deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
