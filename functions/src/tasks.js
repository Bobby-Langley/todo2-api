var admin = require("firebase-admin");
var serviceAccount = require("../credentials.json");

let db;

function dbAuth() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
  }
}
//
exports.getTasks = (req, res) => {
  if(!req.params.userId)
      res.status(400).send('Invalid Request')
  
  dbAuth();
  db.collection("tasks").where('userId', '==', req.params.userId).get()
    .then((collection) => {
      const taskList = collection.docs.map((doc) => {
        let task = doc.data();
        task.id = doc.id;
        return task;
      });
      res.status(200).send(taskList);
    })
    .catch((err) => res.status(500).send("GET TASKS FAILED: " + err));
};
exports.postTask = (req, res) => {
  if (!req.body || !req.body.item || !req.body.userId || !req.params.userId) {
    res.status(400).send("Invalid request");
  }
  dbAuth();
  const newTask = {
    item: req.body.item,
    done: false,
    userId: req.body.userId,
  };
  db.collection("tasks")
    .add(newTask)
    .then(() => {
      this.getTasks(req, res);
    })
    .catch((err) => res.status(500).send("POST FAILED" + err));
    
  };
  exports.patchTask = (req, res) => {
    if (!req.body || !req.body.taskId ) {
      res.status(400).send("Invalid request");
    dbAuth();
  db.collection("tasks").doc(req.params.taskId).update(req.body)
        .then(() => {
            res.status(200).json({
            status: 'successfully successful success',
            message: 'Task updated',
            statusCode: '204'
            })
        })
        .catch(err => {
            res.status(500).send ({
                status: 'errrrrr',
                data: err,
                message: 'Failed to update',
                statusCode: '500'
            })
        })
};
exports.deleteTask = (req, res) => {
  if(!req.params.taskId) {
    res.status(400).send("Invalid request")
  }
  dbAuth();
  db.collection("tasks").doc(req.params.taskId).delete()
  .then(() => {
    res.status(200).json({
      status: 'successfully successful success',
      message: 'Task deleted',
      statusCode: '204'
    })
  })
  .catch(err => {
    res.status(500).send ({
                status: 'errrrrr',
                data: err,
                message: 'Task not deleted',
                statusCode: '500'
              })
            })
            
};
