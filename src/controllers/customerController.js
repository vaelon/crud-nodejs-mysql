const res = require("express/lib/response");

const controller = {};

controller.list = (req, res, next) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.redirect('/?error=' + encodeURIComponent('List failed. DB connection error'));
        } //return next(err);
        conn.query('SELECT * FROM customer', (err, customers) => {
            if (err) {
            return res.redirect('/?error=' + encodeURIComponent('List failed'));
            } //return next(err);
            return res.render('customers', {
                data: customers
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body; //Demo: add dynamic log line here. Capture {req.body}
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO customer set ?', [data], (err, customer) => {
            //Demo: add dynamic log line below. Capture {err} err!=null conditional. add virtual breakpoint err !=null conditional
            if (err) {
           return res.redirect('/?error=' + encodeURIComponent('Insert failed'));
      }
      //Demo Trunc: add dynamic log line below. Capture {customer}
      return res.redirect('/');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM customer WHERE id = ?', [id], (err, rows) => {
           //original code
            if (err) {
                res.json(err);
                setTimeout(() => res.redirect('/'), 600); // <-- still double-sends (crashes),
                                              //     but after 300ms (enough to capture)
    return; // keep control flow tidy
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

controller.update = (req, res, next) => {
    const { id } = req.params;
  //Original Code
    //const newCustomer = req.body;
    //Bug: Swap Order
    const newCustomer = {...req.body};
    //[newCustomer.name, newCustomer.address] = [newCustomer.address, newCustomer.name];
    req.getConnection((err, conn) => {
        //Demo: Add dynamic log here. Capture {newCustomer} payload.
        //BUG: flip argument order
        //conn.query('UPDATE customer set ? WHERE id = ?', [id, newCustomer], (err, rows) => {
        //Original Code
        conn.query('UPDATE customer set ? WHERE id = ?', [newCustomer, id], (err, rows) => {
            //Demo: Optional - add dynamic log at line below. Capture {err}
            if (err) {
                return res.redirect('/?error=' + encodeURIComponent('Update failed'));
            }
            
            res.redirect('/');
        });
    });
};

module.exports = controller;