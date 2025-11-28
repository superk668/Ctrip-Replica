const express = require('express');
const router = express.Router();
const TravelerService = require('../services/travelerService');
const UserService = require('../services/userService');
const authenticateToken = require('../middleware/authenticateToken');
const { successResponse, errorResponse } = require('../utils/response');

// Middleware for all routes
router.use(authenticateToken);

// Travelers Routes
router.get('/travelers', async (req, res) => {
  try {
    const { keyword, page, pageSize } = req.query;
    const result = await TravelerService.listTravelers(req.user.userId, { keyword, page, pageSize });
    res.json(successResponse(result));
  } catch (error) {
    console.error('List travelers error:', error);
    res.status(500).json(errorResponse('Service unavailable.'));
  }
});

router.get('/travelers/:id', async (req, res) => {
  try {
    const traveler = await TravelerService.getTraveler(req.user.userId, req.params.id);
    if (!traveler) {
      return res.status(404).json(errorResponse('Traveler not found.'));
    }
    res.json(successResponse({ traveler }));
  } catch (error) {
    console.error('Get traveler error:', error);
    res.status(500).json(errorResponse('Service unavailable.'));
  }
});

router.post('/travelers', async (req, res) => {
  try {
    const result = await TravelerService.createTraveler(req.user.userId, req.body);
    res.status(201).json(successResponse(result));
  } catch (error) {
    if (error.message === 'Document already exists') {
      return res.status(409).json(errorResponse('Document already exists.'));
    }
    console.error('Create traveler error:', error);
    res.status(500).json(errorResponse('Service unavailable.'));
  }
});

router.put('/travelers/:id', async (req, res) => {
  try {
    const result = await TravelerService.updateTraveler(req.user.userId, req.params.id, req.body);
    if (!result) {
      return res.status(404).json(errorResponse('Traveler not found.'));
    }
    res.json(successResponse(result));
  } catch (error) {
    if (error.message === 'Document already exists') {
      return res.status(409).json(errorResponse('Document already exists.'));
    }
    console.error('Update traveler error:', error);
    res.status(500).json(errorResponse('Service unavailable.'));
  }
});

router.delete('/travelers', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json(errorResponse('Please select records first.'));
    }
    const deleted = await TravelerService.deleteTravelers(req.user.userId, ids);
    res.json(successResponse({ deleted }));
  } catch (error) {
    if (error.message === 'Contains non-deletable travelers') {
      return res.status(409).json(errorResponse('Contains non-deletable travelers.'));
    }
    console.error('Delete travelers error:', error);
    res.status(500).json(errorResponse('Service unavailable.'));
  }
});

// Profile Routes
router.get('/profile', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    const profile = await UserService.getProfile(req.user.userId);
    const user = await UserService.findUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    // Mask phone number
    const phoneMasked = user.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '';
    
    res.json(successResponse({
      phoneMasked,
      emailStatus: user.email ? '已绑定' : '未绑定', // Simplified logic
      nickname: profile?.nickname || '',
      name: profile?.name || '',
      gender: profile?.gender || '',
      birthday: profile?.birthday || ''
    }));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(errorResponse('Service unavailable.'));
  }
});

router.patch('/profile', async (req, res) => {
  try {
    const { nickname, name, gender, birthday } = req.body;
    // Simple validation
    if (nickname && nickname.length > 20) return res.status(400).json(errorResponse('Invalid input: nickname<=20'));
    if (name && (name.length > 30 || /\d/.test(name))) return res.status(400).json(errorResponse('Invalid input: name<=30 no digits'));
    if (birthday) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return res.status(400).json(errorResponse('Invalid input: birthday format yyyy-MM-dd'));
      const birthDate = new Date(birthday);
      const today = new Date();
      // Set time to 0 to compare dates only, or just loose compare
      today.setHours(0,0,0,0);
      if (birthDate > today) return res.status(400).json(errorResponse('Invalid input: birthday cannot be in future'));
    }
    
    await UserService.updateProfile(req.user.userId, { nickname, name, gender, birthday });
    
    // Return updated profile
    const profile = await UserService.getProfile(req.user.userId);
    res.json(successResponse({
      nickname: profile.nickname,
      name: profile.name,
      gender: profile.gender,
      birthday: profile.birthday
    }));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json(errorResponse('Service unavailable.'));
  }
});

module.exports = router;
