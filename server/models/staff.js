import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  }
});

const Staff = mongoose.model('Staff', staffSchema);

export default  Staff;