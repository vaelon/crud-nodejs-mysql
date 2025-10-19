const res = require("express/lib/response");

const controller = {};

controller.list = (req, res, next) => {
    req.getConnection((err, conn) => {
        if (err) return next(err);
        conn.query('SELECT * FROM customer', (err, customers) => {
            if (err) return next(err);
            return res.render('customers', {
                data: customers
            });
        });
    });
};

controller.save = (req, res, next) => {
    const data = req.body;
// add dynamic log here to show submitted customer data
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO customer set ?', [data], (err, customer) => {
            if (err) {
            return res.redirect('/?error=' + encodeURIComponent('Insert failed'));
      }
      return res.redirect('/');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM customer WHERE id = ?', [id], (err, rows) => {
            if (err) {
                res.json(err);
            }

            res.redirect('/');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM customer WHERE id = ?', [id], (err, customer) => {
            if (err) {
                res.json(err);
            }
            
            res.render('customer_edit', {
                data: customer[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
     const newCustomer = { ...req.body };

  // BUG (demo): swap name <-> address
  [newCustomer.name, newCustomer.address] = [newCustomer.address, newCustomer.name];
  //Original code below. Built newCustomer object from middleware express-connection 
  //const newCustomer = req.body;
    
    req.getConnection((err, conn) => {
        conn.query('UPDATE customer set ? WHERE id = ?', [newCustomer, id], (err, rows) => {
            if (err) {
                res.json(err);
            }
            
            res.redirect('/');
        });
    });
};

module.exports = controller;