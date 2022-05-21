import mongoose from 'mongoose'

mongoose
  .connect(process.env.DB_CLUSTER_URI)
  .then(() => console.log('DB Connection initialized'))
  .catch(err => console.log(err))