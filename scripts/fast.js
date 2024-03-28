import fs from 'fs';
import {template, vue} from "./template.js";

// 读取 JSON 文件
const readJsonFile = async (workflow) => {
    workflow = './workflow/' + workflow + '.json'
    try {
        const jsonData = fs.readFileSync(workflow, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('读取 JSON 文件出错：', error);
        return false;
    }
};
const generateTemplate = async (model,inputs) => {
    let html = '';
    for (const key in inputs) {
        if (inputs.hasOwnProperty(key)) {
            html += await template(key, inputs[key],model)
        }
    }
    return html;
}
// 通过 process.argv 获取传递的参数
const args = process.argv.slice(2);
const workflowArg = args.find(arg => arg.startsWith('--workflow='));
const workflow = workflowArg ? workflowArg.split('=')[1] : null;
if (!workflow) {
    console.error('未指定工作流');
    process.exit(1);
}
// const workflow = 'workflow_api'
// 调用函数读取 JSON 文件
const jsonData = await readJsonFile(workflow);
if (!jsonData) {
    console.error('读取工作流文件失败。');
} else {
    let form = ''
    for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            const item = jsonData[key];
            // console.log(item)
            // console.log(`Key: ${key}`);
            // console.log(`Inputs:`, item.inputs);
            form += `${await generateTemplate(key,item.inputs)}\n`;
            // console.log(`Class Type: ${item.class_type}`);
            // console.log(`Meta Title: ${item._meta.title}`);
            // console.log('---------------------------');
        }
    }
    let html = vue(form,jsonData)
    const fileName = './src/components/' + workflow + '.vue';
    try {
        fs.writeFileSync(fileName, html);
        console.log(`模板已成功写入文件：${fileName}`);
    } catch (error) {
        console.error('写入文件出错：', error);
    }
}
