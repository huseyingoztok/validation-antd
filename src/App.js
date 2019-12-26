import React from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import "./App.css";
const PostMovieForm = props => {
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        //if (values.title === 'yiminghe') {
        //  props.form.setFields({
        //    title: {
        //      value: values.title,
        //      errors: [new Error('forbid ha'), new Error('forbid ha2'), new Error('forbid ha3')],
        //    },
        //  });
        //}
        axios
          .post(`http://localhost:8080/api/courses`, values)
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.error(err.response.data.errors);

            const errorArray = err.response.data.errors.map(error => {
              const errObj = {}
              errObj[error.field] = {
                value: values[error.field],
                errors: error.errors.map(errMessage => new Error(errMessage))
              }
              console.log(errObj);
              return errObj;
            })
            console.log(errorArray);
            props.form.setFields(
                ...errorArray
            );
          });
      }
    });
  };

  const { getFieldDecorator } = props.form;
  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        {getFieldDecorator("title", {
          rules: [{ required: true, message: "Please input course title!" }]
        })(<Input placeholder="Title" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("cover", {
          rules: [{ required: true, message: "Please input course cover!" }]
        })(<Input placeholder="Cover" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("instructor", {
          
        })(<Input placeholder="Instructor" />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

const CreatePostMovieForm = Form.create({ name: "normal_login" })(
  PostMovieForm
);

export default CreatePostMovieForm;
