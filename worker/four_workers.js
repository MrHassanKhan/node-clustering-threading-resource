// Optimizing a CPU-Intensive Task Using Four Worker Threads
// In this section, you will divide the CPU-intensive task among four worker threads 
//so that they can finish the task faster and shorten the load time of the /blocking route.

// To have more worker threads work on the same task, you will need to split the tasks. 
// Since the task involves looping 20 billion times, 
// you will divide 20 billion with the number of threads you want to use. 
// In this case, it is 4. Computing 20_000_000_000 / 4 will result in 5_000_000_000. 
// So each thread will loop from 0 to 5_000_000_000 and increment counter by 1. 
// When each thread finishes, it will send a message to the main thread containing the result. 
// Once the main thread receives messages from all the four threads separately, 
// you will combine the results and send a response to the user.

// You can also use the same approach if you have a task that iterates over large arrays. 
// For example, if you wanted to resize 800 images in a directory, you can create an array containing all the image file paths.
// Next, divide 800 by 4(the thread count) and have each thread work on a range. 
// Thread one will resize images from the array index 0 to 199, thread two from index 200 to 399, and so on.

// First, verify that you have four or more cores:

const { workerData, parentPort } = require("worker_threads");

let counter = 0;
for (let i = 0; i < 20000000000 / workerData.thread_count; i++) {
  counter++;
}

parentPort.postMessage(counter);