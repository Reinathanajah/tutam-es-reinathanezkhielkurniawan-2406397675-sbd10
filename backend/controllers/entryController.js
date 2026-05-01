import Entry from '../models/Entry.js';
import User from '../models/User.js';

export const createEntry = async (req, res) => {
  try {
    const { type, title } = req.body;
    
    if (req.user.tier === 'FREE' && type === 'Diary') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const entryCount = await Entry.countDocuments({
        user: req.user.id,
        type: 'Diary',
        createdAt: { $gte: today, $lt: tomorrow }
      });

      if (entryCount >= 5) {
        return res.status(403).json({ message: 'FREE tier limit reached. Max 5 diaries per day.' });
      }
    }

    if (type === 'Diary') {
      const user = await User.findById(req.user.id);
      if (!user.diaryCollection) {
        user.diaryCollection = { initializedAt: new Date() };
        await user.save();
      }
      
      const entryData = { ...req.body, user: req.user.id };
      
      const entry = new Entry(entryData);
      await entry.save();
      return res.status(201).json(entry);
    } else {

      const user = await User.findById(req.user.id);
      if (!user.markerCollection) {
        user.markerCollection = { initializedAt: new Date() };
        await user.save();
      }
      const entry = new Entry({ ...req.body, user: req.user.id });
      await entry.save();
      return res.status(201).json(entry);
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOwnEntries = async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPublicDiaries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const entries = await Entry.find({ type: 'Diary', isPublic: true })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Entry.countDocuments({ type: 'Diary', isPublic: true });

    res.status(200).json({
      entries,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (entry.type === 'Diary') {
      return res.status(403).json({ message: 'Diary entries are immutable and cannot be updated.' });
    }

    const updatedEntry = await Entry.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (entry.type !== 'Diary') {
      return res.status(400).json({ message: 'Comments are only allowed on Diary entries' });
    }
    
    const user = await User.findById(req.user.id);

    entry.comments.push({
      user: req.user.id,
      username: user.username,
      text
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
