// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//     this.queryStr = {};
//   }

//   filter() {
//     let queryObj = { ...this.queryString };
//     const excludeFields = ["page", "sort", "limit", "fields", "search"];
//     excludeFields.forEach((el) => delete queryObj[el]);

//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     this.query = this.query.find(JSON.parse(queryStr));
//     this.queryStr = queryObj;
//     return this;
//   }

//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(",").join(" ");
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort("-createdAt");
//     }
//     return this;
//   }

//   limitFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(",").join(" ");
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select("-__v");
//     }
//     return this;
//   }

//   paginate() {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 10;
//     const skip = (page - 1) * limit;
//     this.query = this.query.skip(skip).limit(limit);

//     return this;
//   }

//   search() {
//     if (this.queryString.search) {
//       const searchQuery = this.queryString.search;
//       this.query = this.query.find({
//         $or: [
//           { name: { $regex: searchQuery, $options: "i" } },
//           { description: { $regex: searchQuery, $options: "i" } },
//           { tags: { $regex: searchQuery, $options: "i" } },
//           { brand: { $regex: searchQuery, $options: "i" } },
//         ],
//       });
//     }
//     return this;
//   }
// }

// module.exports = APIFeatures;
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = { ...queryString }; // Store a copy of the original query string
    this.queryStr = {}; // Initialize queryStr
  }

  filter() {
    let queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields", "search"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    this.queryStr = queryObj; // Update queryStr with applied filters
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 2;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // Update queryStr to include pagination info
    this.queryStr.page = page;
    this.queryStr.limit = limit;

    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchQuery = this.queryString.search;
      this.query = this.query.find({
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { tags: { $regex: searchQuery, $options: "i" } },
          { brand: { $regex: searchQuery, $options: "i" } },
        ],
      });
    }
    return this;
  }
}

module.exports = APIFeatures;
