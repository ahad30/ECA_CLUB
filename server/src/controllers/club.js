const Club = require('../models/club');

const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.status(200).json({
      success: true,
      data: club
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid club ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const createClub = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Club name is required'
      });
    }

    // Check if club name already exists (case-insensitive)
    const existingClub = await Club.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingClub) {
      return res.status(400).json({
        success: false,
        message: 'Club name already exists'
      });
    }

    const club = await Club.create({ name });

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: club
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Club name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const updateClub = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Club name is required for update'
      });
    }

    // Check if club name already exists (excluding current club)
    const existingClub = await Club.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: req.params.id }
    });

    if (existingClub) {
      return res.status(400).json({
        success: false,
        message: 'Club name already exists'
      });
    }

    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Club updated successfully',
      data: club
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid club ID'
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Club name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const deleteClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Club deleted successfully',
      data: {}
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid club ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getClubs,
  getClub,
  createClub,
  updateClub,
  deleteClub
};