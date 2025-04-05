import 'dotenv/config'; // This is the ES module way to load environment variables
import app from './config/server';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
})
