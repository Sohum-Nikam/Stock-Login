const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  legalName: String,
  age: Number,
  gender: String,
  email: String,
  address: String,
  panNumber: String,
  panName: String,
  accountNumber: String,
  confirmAccountNumber: String,
  accountHolderName: String,
  bankName: String,
  ifscCode: String,
  branchName: String,
  accountType: String,
  identityProofType: String,
  citizenship: Boolean,
  terms: Boolean
});

module.exports = mongoose.model('User', userSchema);