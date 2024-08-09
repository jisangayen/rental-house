const Listing = require('../models/listing');
const { listingSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');

// Controller for INDEX
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
};

// Render form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
};

// Show a specific listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');

    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing, currUser: req.user });
};

// Create a new listing
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "...", filename);
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    await newListing.save();
    req.flash('success', 'New Listing Created!!!');
    res.redirect('/listings');
};

// Render form to edit a listing
module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_120/bo_2px_solid_grey");
    res.render('listings/edit.ejs', { listing, originalImageUrl });
};

// Update a specific listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    if (!req.body.listing) {
        throw new ExpressError(400, 'Send valid data for listing');
    }
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash('success', 'Listing updated!!!');
    res.redirect(`/listings/${id}`);
};

// Delete a specific listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    req.flash('success', 'Listing deleted!!!');
    res.redirect('/listings');
};
