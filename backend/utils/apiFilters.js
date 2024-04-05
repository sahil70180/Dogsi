class APIFilters{
    constructor (query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    
    search(){
        // search using ternary operator 
        // if found then serch 
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword,
                $options : "i", // keyword is case insensitive
            }
        }
        // otherwise return empty object 
        : {};

    this.query = this.query.find({...keyword});
    return this;
    }

    filters(){
        const queryCopy = {...this.queryStr}
        // remove keyword from querycopy because we already handle it in search function  

        const fieldsToRemove = ['keyword', 'page']
        fieldsToRemove.forEach((element) => delete queryCopy[element]);
        

        // advance mongoose filters [gt, gte, lt, lte]
        let queryStr = JSON.stringify(queryCopy); // convert copy into string so that we manipulate it(Add $)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)


        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }

    pagination(responsePerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = responsePerPage*(currentPage - 1);

        this.query = this.query.limit(responsePerPage).skip(skip);
        return this;

    }
}

export default APIFilters;