import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '$',
      currentDate: '',
      invoiceNumber: 1,
      dateOfIssue: '',
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billToRUT: '',
      billFrom: 'Agrupación de Discapacitados Auditivos Provincia del Marga Marga',
      billFromEmail: 'campus@sordosdemargamarga.cl',
      billFromAddress: 'Quilpué',
      billFromRUT: '65081067-8',
      billFromGiro: 'Asesoría y Capacitación en Lengua de Señas',
      notes: 'Sólo mediante transferencia hacia Banco del Estado. Cuenta vista: 254-7-010850-1 RUT, Nombre y correo: Están ya incluidos en este documento, en el campo "Prestador". Se emite factura exenta. Acerca sobre modalidad, fechas de inicio y término, lugar de realización deben ser definidas, estas pueden ser aclaradas posteriormente según coordinación entre ambas partes.',
      total: '0',
      subTotal: '0',
      taxRate: '',
      taxAmmount: '0',
      discountRate: '',
      discountAmmount: '0'
    };
    this.state.items = [
      {
        id: 0,
        name: '',
        description: '',
        price: '1',
        quantity: 1
      }
    ];
    this.editField = this.editField.bind(this);
  }
  componentDidMount(prevProps) {
    this.handleCalculateTotal()
  }
  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
  };
  handleAddEvent(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: '',
      price: '1',
      description: '',
      quantity: 1
    }
    this.state.items.push(items);
    this.setState(this.state.items);
  }
  handleCalculateTotal() {
    var items = this.state.items;
    var subTotal = 0;

    items.map(function(items) {
      subTotal = parseFloat(subTotal + (parseFloat(items.price).toFixed(0) * parseInt(items.quantity))).toFixed(0)
    });

    this.setState({
      subTotal: parseFloat(subTotal).toFixed(0)
    }, () => {
      this.setState({
        taxAmmount: parseFloat(parseFloat(subTotal) * (this.state.taxRate / 100)).toFixed(0)
      }, () => {
        this.setState({
          discountAmmount: parseFloat(parseFloat(subTotal) * (this.state.discountRate / 100)).toFixed(0)
        }, () => {
          this.setState({
            total: ((subTotal - this.state.discountAmmount) + parseFloat(this.state.taxAmmount))
          });
        });
      });
    });

  };
  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var items = this.state.items.slice();
    var newItems = items.map(function(items) {
      for (var key in items) {
        if (key == item.name && items.id == item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.setState({items: newItems});
    this.handleCalculateTotal();
  };
  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    this.handleCalculateTotal();
  };
  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };
  openModal = (event) => {
    event.preventDefault()
    this.handleCalculateTotal()
    this.setState({isOpen: true})
  };
  closeModal = (event) => this.setState({isOpen: false});
  render() {
    return (<Form onSubmit={this.openModal}>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div class="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div class="mb-2">
                    <span className="fw-bold">Emisión:</span>
                    <span className="current-date">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Vencimiento:</span>
                  <Form.Control type="date" value={this.state.dateOfIssue} name={"dateOfIssue"} onChange={(event) => this.editField(event)} style={{
                      maxWidth: '150px'
                    }} required="required"/>
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Número de folio:&nbsp;</span>
                <Form.Control type="number" value={this.state.invoiceNumber} name={"invoiceNumber"} onChange={(event) => this.editField(event)} min="1" style={{
                    maxWidth: '70px'
                  }} required="required"/>
              </div>
            </div>
            <hr className="my-4"/>
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Cliente:</Form.Label>
                <Form.Control placeholder={"¿Para quién es este documento?"} rows={3} value={this.state.billTo} type="text" name="billTo" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required"/>
                <Form.Control placeholder={"Correo electrónico"} value={this.state.billToEmail} type="email" name="billToEmail" className="my-2" onChange={(event) => this.editField(event)} autoComplete="email" required="required"/>
                <Form.Control placeholder={"Dirección de facturación"} value={this.state.billToAddress} type="text" name="billToAddress" className="my-2" autoComplete="address" onChange={(event) => this.editField(event)} />
                <Form.Control placeholder={"R.U.T."} value={this.state.billToRUT} type="text" name="billToRUT" className="my-2" autoComplete="Rut" onChange={(event) => this.editField(event)} />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Prestador:</Form.Label>
                <Form.Control placeholder={"¿Quién es el prestador?"} rows={3} value={this.state.billFrom} type="text" name="billFrom" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required"/>
                <Form.Control placeholder={"Correo electrónico"} value={this.state.billFromEmail} type="email" name="billFromEmail" className="my-2" onChange={(event) => this.editField(event)} autoComplete="email" required="required"/>
                <Form.Control placeholder={"Dirección de facturación"} value={this.state.billFromAddress} type="text" name="billFromAddress" className="my-2" autoComplete="address" onChange={(event) => this.editField(event)} />
                <Form.Control placeholder={"R.U.T."} value={this.state.billFromRUT} type="text" name="billFromRUT" className="my-2" autoComplete="Rut" onChange={(event) => this.editField(event)} />
                <Form.Control placeholder={"R.U.T."} value={this.state.billFromGiro} type="text" name="billFromGiro" className="my-2" autoComplete="Giro" onChange={(event) => this.editField(event)} />
              </Col>
            </Row>
            <InvoiceItem onItemizedItemEdit={this.onItemizedItemEdit.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} currency={this.state.currency} items={this.state.items}/>
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:
                  </span>
                  <span>{this.state.currency}
                    {this.state.subTotal}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Descuento:</span>
                  <span>
                    <span className="small ">({this.state.discountRate || 0}%)</span>
                    {this.state.currency}
                    {this.state.discountAmmount || 0}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">I.V.A:
                  </span>
                  <span>
                    <span className="small ">({this.state.taxRate || 0}%)</span>
                    {this.state.currency}
                    {this.state.taxAmmount || 0}</span>
                </div>
                <hr/>
                <div className="d-flex flex-row align-items-start justify-content-between" style={{
                    fontSize: '1.125rem'
                  }}>
                  <span className="fw-bold">Total:
                  </span>
                  <span className="fw-bold">{this.state.currency}
                    {this.state.total || 0}</span>
                </div>
              </Col>
            </Row>
            <hr className="my-4"/>
            <Form.Label className="fw-bold">Notas:</Form.Label>
            <Form.Control placeholder="Thanks for your business!" name="notes" value={this.state.notes} onChange={(event) => this.editField(event)} as="textarea" className="my-2" rows={1}/>
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="primary" type="submit" className="d-block w-100">Previsualizar cotización</Button>
            <InvoiceModal showModal={this.state.isOpen} closeModal={this.closeModal} info={this.state} items={this.state.items} currency={this.state.currency} subTotal={this.state.subTotal} taxAmmount={this.state.taxAmmount} discountAmmount={this.state.discountAmmount} total={this.state.total}/>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Moneda:</Form.Label>
              <Form.Select onChange={event => this.onCurrencyChange({currency: event.target.value})} className="btn btn-light my-1" aria-label="Change Currency">
                <option value="$">CLP (Peso Chileno)</option>
                <option value="£">USD (Dólar estadounidense)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Impuestos:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control name="taxRate" type="number" value={this.state.taxRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0" min="0" step="0" max="100"/>
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Descuento:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control name="discountRate" type="number" value={this.state.discountRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0" min="0" step="0" max="100"/>
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Form>)
  }
}

export default InvoiceForm;
