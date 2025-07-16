class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    // console.log("-------------------------------------------------");
    // console.log(this.query, this.queryStr);
  }

  filter() {
    let queryString = JSON.stringify(this.queryStr);
    queryString.replace(/\b()\b/g, (match) => {
      `$${match}`;
    });
    //  queryStr.replace(/"(gte|gt|lte|lt)":/g, (match, p1) => `"${"$"}${p1}":`);
    const queryObj = JSON.parse(queryString);

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryStr) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryStr.page) {
    //   const movieCount = await Movie.countDocuments();
    //   if (skip > movieCount) {
    //     throw new Error("This page is not found");
    //   }
    // }
    return this;
  }
}

module.exports = ApiFeatures;
