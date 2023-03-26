import SyntaxHighLighter from 'react-syntax-highlighter';
import { atelierForestDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export default function RequestCard(props: any) {
    return (
        <>
            <div id={props.achor} className="flex flex-row justify-between rounded-xl border border-gray-100 bg-white shadow transition hover:border-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:shadow-gray-800 dark:hover:border-gray-600 p-4 m-4 w-full mt-0">

                <div className="flex flex-col items-start w-2/5 p-4 pr-20">
                    <h1 className="text-2xl font-bold font-mono text-gray-500 dark:text-gray-400">{props.title}</h1>
                    <div className="text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: props.description }}></div>
                </div>

                <div className="w-3/5 rounded-xl border border-gray-100 bg-white shadow transition hover:border-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:shadow-gray-800 dark:hover:border-gray-600">
                    <div className="flex w-full items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 py-2.5 px-5 dark:border-gray-700 dark:bg-gray-700">
                        <span className="text-lg font-bold font-mono text-gray-500 dark:text-gray-400">
                            <span className={props.method == 'POST' ? 'text-red-600' : 'text-green-600'}>{props.method}</span> {props.path}
                        </span>
                    </div>
                    <div className="flex items-start justify-center">
                        <div className="flex flex-col items-start justify-center w-full p-4">
                            <p className="text-gray-500 dark:text-gray-400 pb-2">Request example in {props.language}:</p>
                            <pre>
                                <code className="font-mono text-sm">
                                    <SyntaxHighLighter language="javascript" style={atelierForestDark} showLineNumbers wrapLongLines>
                                        {props.example}
                                    </SyntaxHighLighter>
                                </code>
                            </pre>
                            <div className="w-full h-px my-4 bg-gray-200 dark:bg-gray-700"></div>
                            <p className="text-gray-500 dark:text-gray-400 pb-2">Response example:</p>
                            <pre>
                                <code>
                                    <SyntaxHighLighter language="javascript" style={atelierForestDark} wrapLongLines>
                                        {props.response}
                                    </SyntaxHighLighter>
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}