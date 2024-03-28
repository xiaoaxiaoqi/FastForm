import {__} from "./lang.js";


export const number = (key, value, model) => {
    const label = __(key);
    return `<el-form-item label="${label}">\n` +
        `      <el-input type="number" v-model="form['${model}'].inputs.${key}" />\n` +
        '    </el-form-item>';
}

export const string = (key, value, model) => {
    const label = __(key);
    return `<el-form-item label="${label}">\n` +
        `      <el-input type="text" v-model="form['${model}'].inputs.${key}" />\n` +
        '    </el-form-item>';
}

export const boolean = (key, value, model) => {
    const label = __(key);
    return `<el-form-item label="${label}">
      <el-radio-group v-model="form['${model}'].inputs.${key}">
        <el-radio value="false" border>False</el-radio>
        <el-radio value="true" border>Option B</el-radio>
      </el-radio-group>
    </el-form-item>`;
}

export const sampler_name = (key, value, model) => {
    const label = __(key);
    return `<el-form-item label="${label}"><el-select placeholder="${label}" v-model="form['${model}'].inputs.${key}">
        <el-option :label="item" :value="item" v-for="item in objectInfoList['KSampler']['input']['required']['sampler_name'][0]"/>
      </el-select></el-form-item>`;
}

export const ckpt_name = (key, value, model) => {
    const label = __(key);
    return `<el-form-item label="${label}"><el-select placeholder="${label}" v-model="form['${model}'].inputs.${key}">
        <el-option :label="item" :value="item" v-for="item in objectInfoList['CheckpointLoaderSimple']['input']['required']['ckpt_name'][0]"/>
      </el-select></el-form-item>`;
}

export const scheduler = (key, value, model) => {
    const label = __(key);
    return `<el-form-item label="${label}"><el-select placeholder="${label}" v-model="form['${model}'].inputs.${key}">
        <el-option :label="item" :value="item" v-for="item in objectInfoList['KSampler']['input']['required']['scheduler'][0]"/>
      </el-select></el-form-item>`;
}

export const template = async (key, value, model) => {
    switch (key) {
        case 'sampler_name':
            return sampler_name(key, value, model)
        case 'scheduler':
            return scheduler(key, value, model)
        case 'ckpt_name':
            return ckpt_name(key, value, model)
    }
    switch (typeof value) {
        case 'string':
            return string(key, value, model)
        case 'number':
            return number(key, value, model)
        case 'boolean':
            return boolean(key, value, model)
        case 'object':
            return ''
        default:
            console.log('Value is of unknown type');
    }
};

export const vue = (form, workflow) => {
    return `<script setup>
import {onMounted, ref} from "vue";
import {apiGetObjectInfo, apiHistory, apiPrompt} from "@/utils/api.js";
import {v4 as uuid} from "uuid";
import {ElMessage} from "element-plus";
const init = ref(false)
const form = ref(${JSON.stringify(workflow)});
const labelPosition = ref('top');
const objectInfoList = ref([])
const imageSrc = ref('')
const prompt_id = ref('')

const handlePrompt = async () => {
    prompt_id.value = ''
  imageSrc.value = ''
  try {
    const data = {
      client_id: uuid(),
      prompt: form.value
    }
    const result = await apiPrompt(data)
    if (result && result.prompt_id) {
      prompt_id.value = result.prompt_id
      ElMessage({message: '提交成功', type: 'success'})
      await history()
    } else {
      ElMessage({message: '提交失败', type: 'error'})
    }
  } catch (error) {
    console.error('请求出错:', error);
  }
}
const history = async () => {
  const intervalId = setInterval(async () => {
    try {
      const response = await apiHistory(prompt_id.value)
      if (Object.keys(response).length !== 0) {
        clearInterval(intervalId)
        imageSrc.value = response[prompt_id.value]['outputs']['9']['images'][0]['filename']
        console.log(imageSrc.value)
      }
    } catch (error) {
      console.error('请求出错:', error);
    }
  }, 1000); // 每隔2秒执行一次
}
onMounted(async ()=>{
  try {
    objectInfoList.value = await apiGetObjectInfo()
    init.value = true
  } catch (error) {
    console.error('请求出错:', error);
  }
})
</script>

<template>
<el-row>
<el-col :span="10">
 <el-form
    :label-position="labelPosition"
      label-width="auto"
      :model="form"
      style="max-width: 600px"
      v-if="init"
  >
  ${form}
   </el-form>
   </el-col>
   <el-col :span="14">
      <div style="display: flex;flex-direction: column;align-items: center">
        <el-button type="primary" size="large" @click="handlePrompt">开始生成</el-button>
        <el-image fit="cover" :src="'http://127.0.0.1:8188/view?filename='+imageSrc" v-if="imageSrc"></el-image>
      </div>
    </el-col>
   </el-row>
</template>
<style scoped>

</style>
`;
}
