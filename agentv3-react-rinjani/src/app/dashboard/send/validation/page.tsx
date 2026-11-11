'use client';


export default function SendValidation() {
 
    return (
      <>
              <div className="card mx-10 my-10">
                <div className="card-body h-dvh">
                <h1
                  className="font-large text-teal-600 text-lg md:text-lg text-center"
                >
                  Send Transaction
                </h1>
                <hr className="text-teal-600"></hr>
                <div className="container mt-5">
                    <form action={'/'} method="POST">
                        <div className="row form-group border-b-2 mb-3 py-3 border-grey-100">
                            <div className="col-4">
                                <label>Destination Country</label>
                            </div>
                            <div className="col-4">
                                <select className="form-control" required> 
                                <option value={''}>Choose</option>
                                </select>
                            </div>
                        </div>
                        <div className="row form-group border-b-2 mb-3 py-3 border-grey-100">
                            <div className="col-4">
                                <label>Amount</label>
                            </div>
                            <div className="col-4">
                               <input type="text" className="form-control" required/>
                            </div>
                        </div>
                        <div className="row form-group border-b-2 mb-3 py-3 border-grey-100">
                            <div className="col-4">
                                <label>Quote by</label>
                            </div>
                            <div className="col-8">
                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-license" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                            <label htmlFor="horizontal-list-radio-license" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Include Fee </label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-id" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                            <label htmlFor="horizontal-list-radio-id" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Exclude Fee</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-military" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                            <label htmlFor="horizontal-list-radio-military" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Receive Amount</label>
                                        </div>
                                    </li>
                                    
                                </ul>
                            </div>
                        </div>
                        <div className="row form-group border-b-2 mb-3 py-3 border-grey-100">
                            <div className="col-4">
                                <label>Promo Code / Reward</label>
                            </div>
                            <div className="col-4">
                               <input type="text" className="form-control"/>
                            </div>
                        </div>
                        <div className="row form-group border-b-2 mb-3 py-3 border-grey-100">
                            <div className="col-4">
                            </div>                           
                            <div className="col-4">
                                <button className="btn btn-primary w-full">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
                </div>
              </div>
          </>
    );
  }